using Matcha.Home.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Quiz.Enumerations;
using Quiz.Hubs;
using Quiz.Models;
using Quiz.Services;
using Quiz.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Controllers
{
    public class GameController : BaseController
    {
        private readonly IGameService _gameService;
        private readonly IHubContext<GameHub> _hubContext;

        public GameController(IGameService gameService, IHubContext<GameHub> hubContext)
        {
            _gameService = gameService;
            _hubContext = hubContext;
        }

        // GET: Game/Create (Admin only)
        [AuthorizeRole(UserRole.Admin)]
        public IActionResult Create()
        {
            // Generate a unique game code
            var generatedCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
            ViewBag.GameCode = generatedCode;
            return View();
        }

        // POST: Game/Create (Admin only)
        [HttpPost]
        [AuthorizeRole(UserRole.Admin)]
        public IActionResult Create(string code, string title)
        {
            if (_gameService.DoesGameCodeExist(code))
            {
                ModelState.AddModelError("Code", "The game code already exists. Please try again.");
                ViewBag.GameCode = code;
                return View();
            }

            if (string.IsNullOrEmpty(title))
            {
                ModelState.AddModelError("Title", "The game title cannot be empty.");
                ViewBag.GameCode = code;
                return View();
            }

            var user = (User)HttpContext.Items["User"];
            var game = new Game
            {
                Code = code,
                Title = title,
                CreatedByUserId = user.Id, // Associate the game with the admin who created it
                Questions = _gameService.GetAllMythologyQuestions() // Use static questions
            };

            _gameService.AddGame(game);
            return RedirectToAction("Details", new { code = game.Code });
        }

        public async Task<IActionResult> SubmitAnswers([FromBody] SubmitAnswersRequest request)
        {
            // Retrieve the game by code
            var game = _gameService.GetGameByCode(request.Code);
            if (game == null)
            {
                return RedirectToAction("Error", new { message = "Invalid game code." });
            }

            var categoryScores = new Dictionary<QuestionCategory, int>();
            int correctAnswersCount = 0;
            int totalQuestionsCount = game.Questions.Count;

            foreach (var question in game.Questions)
            {
                var answer = request.Answers.FirstOrDefault(a => a.QuestionId == question.Id);

                if (answer != null && answer.AnswerText == question.CorrectAnswer)
                {
                    correctAnswersCount++;
                    if (categoryScores.ContainsKey(question.Category))
                    {
                        categoryScores[question.Category]++;
                    }
                    else
                    {
                        categoryScores[question.Category] = 1;
                    }
                }
            }

            // Calculate total score as a percentage of correct answers
            double totalScore = ((double)correctAnswersCount / totalQuestionsCount) * 10;

            // Save score for guest or registered user
            if (request.UserId == null)
            {
                await _gameService.SaveGuestScore(request.Code, request.PlayerName, totalScore, categoryScores);
            }
            else
            {
                await _gameService.SaveScore(request.Code, request.UserId, request.PlayerName, totalScore, categoryScores);
            }

            // Notify all clients about the score update
            await _hubContext.Clients.Group(request.Code).SendAsync("ReceiveScoreUpdate", request.PlayerName, totalScore, categoryScores);

            return Ok(new { message = $"{request.PlayerName} đã hoàn thành {request.Category}" });
        }


        // GET: Game/Statistics (Admin only)
        [AuthorizeRole(UserRole.Admin)]
        public IActionResult Statistics()
        {
            var user = (User)HttpContext.Items["User"];
            var games = _gameService.GetGamesCreatedByAdmin(user.Id);

            var model = new StatisticsViewModel
            {
                Games = games.Select(game => new GameStatistics
                {
                    GameCode = game.Code,
                    Title = game.Title,
                    Players = _gameService.GetPlayersByGame(game.Id) // Fetch players in each game
                }).ToList()
            };

            return View(model);
        }

        // GET: Game/Play (handles both registered users and guests)
        public IActionResult Play(string code, int? userId, string playerName)
        {
            var game = _gameService.GetGameByCode(code);
            if (game != null)
            {
                ViewBag.UserId = userId;
                ViewBag.PlayerName = playerName; // Send guest playerName to the view
                return View(game);
            }
            ViewData["CategoryFriendlyNames"] = CategoryFriendlyNames;
            return View("Error", new { message = "Không tìm thấy game code." });
        }

        // GET: Game/Details
        public IActionResult Details(string message)
        {
            ViewBag.Message = message;
            return View();
        }

        // POST: Join a game (handles both registered users and guests)
        [HttpPost]
        public IActionResult JoinGame(string code, string playerName)
        {
            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(playerName))
            {
                // Add logging to see what values are being passed
                Console.WriteLine($"Missing input: Code={code}, PlayerName={playerName}");
                return RedirectToAction("Error", new { message = "Game code or player information is missing." });
            }

            var game = _gameService.GetGameByCode(code);
            if (game == null)
            {
                ModelState.AddModelError("", "Không tìm thấy game code.");
                return View("JoinGame", new { code, playerName });
            }

            // Try to get the user (this will return null for guest players)
            var user = _gameService.GetUserByName(playerName);

            if (user != null)
            {
                _hubContext.Clients.Group(code).SendAsync("NewPlayerJoined", playerName);
                // Redirect to Play, passing the GameCode and UserId for registered users
                return RedirectToAction("Play", new { code = code, userId = user.Id });
            }
            else
            {
                _hubContext.Clients.Group(code).SendAsync("NewPlayerJoined", playerName);
                // Redirect to PlayAsGuest for guest players, passing the GameCode and PlayerName
                return RedirectToAction("PlayAsGuest", new { code = code, playerName = playerName });
            }

        }

        // Play as a guest user
        public IActionResult PlayAsGuest(string code, string playerName)
        {
            var game = _gameService.GetGameByCode(code);
            if (game == null)
            {
                return View("Error", new { message = "Không tìm thấy game code." });
            }
            ViewData["CategoryFriendlyNames"] = CategoryFriendlyNames;
            ViewBag.PlayerName = playerName; // Send player name to the view for guest users
            return View("Play", game); // Render the Play view, but treat this as a guest
        }

        private readonly Dictionary<QuestionCategory, string> CategoryFriendlyNames = new Dictionary<QuestionCategory, string>
        {
            { QuestionCategory.VietnameseMythology, "Thần thoại Việt Nam" },
            { QuestionCategory.ChineseMythology, "Thần thoại Trung Quốc" },
            { QuestionCategory.GreekMythology, "Thần thoại Hy Lạp" },
            { QuestionCategory.IndianMythology, "Thần thoại Ấn Độ" }
        };

    }
}
