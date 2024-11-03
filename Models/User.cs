using Quiz.Enumerations;
using System.Collections.Generic;

namespace Quiz.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; } // Hashed password
        public string Salt { get; set; } // Salt used for hashing
        public UserRole Role { get; set; } // Admin or General

        // Navigation property for the games the user has created
        public List<Game> CreatedGames { get; set; } // A user can create many games
    }

}
