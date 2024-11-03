using Matcha.Home.Controllers;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Quiz.Data;
using Quiz.Enumerations;
using Quiz.Models;
using Quiz.ViewModels;
using System;
using System.Linq;
using System.Security.Cryptography;

namespace Quiz.Controllers
{
    public class UserController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: User/Register
        public IActionResult Register()
        {
            return View();
        }

        // POST: User/Register
        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Check if username already exists
                if (_context.Users.Any(u => u.Username == model.Username))
                {
                    ModelState.AddModelError("Username", "Username already exists. Please choose a different one.");
                    return View(model);
                }

                // Generate salt and hash the password
                var salt = GenerateSalt();
                var passwordHash = HashPassword(model.Password, salt);

                // Create a new user and save it to the database
                var user = new User
                {
                    Username = model.Username,
                    PasswordHash = passwordHash,
                    Salt = Convert.ToBase64String(salt), // Store the salt
                    Role = UserRole.General // Default role
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                return RedirectToAction("Login");
            }

            return View(model);
        }


        // GET: User/Login
        public IActionResult Login()
        {
            return View();
        }

        // POST: User/Login
        [HttpPost]
        public IActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Find the user by username
                var user = _context.Users.SingleOrDefault(u => u.Username == model.Username);
                if (user == null || !VerifyPassword(user.PasswordHash, model.Password, user.Salt))
                {
                    ModelState.AddModelError("", "Invalid username or password.");
                    return View(model);
                }

                // Authentication successful, store user information in session
                HttpContext.Session.SetString("UserId", user.Id.ToString());
                HttpContext.Session.SetString("Username", user.Username);
                HttpContext.Session.SetString("Role", user.Role.ToString());

                // Redirect to the home game page
                return RedirectToAction("Index", "Home");
            }

            return View(model);
        }


        // Logout
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }

        private string HashPassword(string password, byte[] salt)
        {
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8)); // Length of the resulting hash
            return hashed;
        }



        private byte[] GenerateSalt()
        {
            byte[] salt = new byte[128 / 8]; // 16 bytes salt
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }
        private bool VerifyPassword(string storedHash, string providedPassword, string storedSalt)
        {
            // Convert the stored salt back to byte array
            var saltBytes = Convert.FromBase64String(storedSalt);

            // Hash the provided password with the stored salt
            var hashedProvidedPassword = HashPassword(providedPassword, saltBytes);

            // Compare the hashed passwords
            return storedHash == hashedProvidedPassword;
        }

    }
}
