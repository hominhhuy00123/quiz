using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Quiz.Data;
using Quiz.Enumerations;
using Quiz.Hubs;
using Quiz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.Services
{
    public interface IGameService
    {
        void AddGame(Game game);
        Game GetGameByCode(string code);
        Task SaveScore(string code, int? userId, string playerName, double totalScore, Dictionary<QuestionCategory, int> categoryScores);

        List<PlayerScore> GetPlayersAndScores(string code);
        void UpdatePlayerScore(string gameCode, int? userId, string playerName, int score); // Updated to allow guest players
        bool DoesGameCodeExist(string code);
        List<Game> GetGamesCreatedByAdmin(int adminUserId);
        List<PlayerScore> GetPlayersByGame(int gameId);
        List<Question> GetAllMythologyQuestions();
        User GetUserByName(string playerName);
        Task SaveGuestScore(string gameCode, string playerName, double categoryScore, Dictionary<QuestionCategory, int> categoryScores);
    }

    public class GameService : IGameService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<GameHub> _hubContext;

        public GameService(ApplicationDbContext context, IHubContext<GameHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Add a new game to the database
        public void AddGame(Game game)
        {
            _context.Games.Add(game);
            _context.SaveChanges();
        }

        // Get a game by its unique code
        public Game GetGameByCode(string code)
        {
            return _context.Games
                .Include(g => g.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefault(g => g.Code == code);
        }

        public async Task SaveGuestScore(string gameCode, string playerName, double categoryScore, Dictionary<QuestionCategory, int> categoryScores)
        {
            // Retrieve the game by code
            var game = _context.Games.FirstOrDefault(g => g.Code == gameCode);
            if (game != null)
            {
                // Check if the player already has a score entry in this game
                var playerScore = _context.PlayerScores
                    .FirstOrDefault(ps => ps.PlayerName == playerName && ps.GameId == game.Id)
                    ?? new PlayerScore { PlayerName = playerName, GameId = game.Id };

                // Update the total score for the player
                playerScore.TotalScore += categoryScore;

                // Update the category-specific scores, ensuring previous scores are retained
                foreach (var category in categoryScores.Keys)
                {
                    if (playerScore.CategoryScores.ContainsKey(category))
                    {
                        // If the category already exists, increment the existing score
                        playerScore.CategoryScores[category] += categoryScores[category];
                    }
                    else
                    {
                        // Otherwise, add a new category score
                        playerScore.CategoryScores[category] = categoryScores[category];
                    }
                }

                // Save the updated CategoryScores as JSON to persist in the database
                playerScore.CategoryScoresJson = JsonConvert.SerializeObject(playerScore.CategoryScores);


                // If this is a new player score, add it to the database
                if (playerScore.Id == 0)
                {
                    _context.PlayerScores.Add(playerScore);
                }

                // Commit the changes
                await _context.SaveChangesAsync();

                // Broadcast the updated score to all clients in the game group
                await _hubContext.Clients.Group(gameCode).SendAsync("ReceiveScoreUpdate", playerName, playerScore.TotalScore, playerScore.CategoryScores);
            }
        }


        public async Task SaveScore(string code, int? userId, string playerName, double totalScore, Dictionary<QuestionCategory, int> categoryScores)
        {
            var game = _context.Games.FirstOrDefault(g => g.Code == code);
            if (game == null) return;

            var playerScore = _context.PlayerScores.FirstOrDefault(ps => ps.UserId == userId && ps.GameId == game.Id);

            if (playerScore != null)
            {
                // Update total score
                playerScore.TotalScore += totalScore;

                // Update each category score without overwriting existing ones
                foreach (var category in categoryScores.Keys)
                {
                    if (playerScore.CategoryScores.ContainsKey(category))
                    {
                        playerScore.CategoryScores[category] += categoryScores[category];
                    }
                    else
                    {
                        playerScore.CategoryScores[category] = categoryScores[category];
                    }
                }
            }
            else
            {
                // New score entry for the player
                playerScore = new PlayerScore
                {
                    UserId = userId,
                    GameId = game.Id,
                    TotalScore = totalScore,
                    CategoryScores = new Dictionary<QuestionCategory, int>(categoryScores) // Initialize with current category scores
                };
                _context.PlayerScores.Add(playerScore);
            }


            await _context.SaveChangesAsync();
            await _hubContext.Clients.Group(code).SendAsync("ReceiveScoreUpdate", playerName ?? playerScore.User?.Username, totalScore, categoryScores);
        }


        public List<PlayerScore> GetPlayersAndScores(string code)
        {
            var game = _context.Games.FirstOrDefault(g => g.Code == code);
            if (game == null) return new List<PlayerScore>(); // Handle game not found

            var playerScores = _context.PlayerScores
                .Where(ps => ps.GameId == game.Id)
                .Include(ps => ps.User) // Include the player (User) information
                .ToList();

            // Deserialize CategoryScoresJson for each player and populate CategoryScores
            foreach (var playerScore in playerScores)
            {
                if (!string.IsNullOrEmpty(playerScore.CategoryScoresJson))
                {
                    playerScore.CategoryScores = JsonConvert.DeserializeObject<Dictionary<QuestionCategory, int>>(playerScore.CategoryScoresJson);
                }
                else
                {
                    playerScore.CategoryScores = new Dictionary<QuestionCategory, int>();
                }
            }

            return playerScores;
        }

        // Check if a game code already exists
        public bool DoesGameCodeExist(string code)
        {
            return _context.Games.Any(g => g.Code == code);
        }

        // Update player score for both registered and guest players
        public void UpdatePlayerScore(string gameCode, int? userId, string playerName, int score)
        {
            if (userId.HasValue)
            {
                // Fetch the user by userId
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null) return; // Handle case where user doesn't exist

                // Broadcast the updated score to all clients in the game group
                _hubContext.Clients.Group(gameCode).SendAsync("ReceiveScoreUpdate", user.Username, score);
            }
            else
            {
                // Handle guest player update
                _hubContext.Clients.Group(gameCode).SendAsync("ReceiveScoreUpdate", playerName, score);
            }
        }

        // Get all games created by a specific admin user
        public List<Game> GetGamesCreatedByAdmin(int adminUserId)
        {
            return _context.Games
                .Include(g => g.CreatedBy) // Include the admin who created the game
                .Where(g => g.CreatedByUserId == adminUserId)
                .ToList();
        }

        // Get all players currently playing a game by GameId
        public List<PlayerScore> GetPlayersByGame(int gameId)
        {
            return _context.PlayerScores
                .Where(ps => ps.GameId == gameId)
                .Include(ps => ps.User) // Include the player (User) information
                .ToList();
        }

        public User GetUserByName(string playerName)
        {
            return _context.Users
                .AsEnumerable() // Move the comparison to client side
                .FirstOrDefault(u => u.Username.Equals(playerName, StringComparison.OrdinalIgnoreCase));
        }


        // Method to return static questions
        public List<Question> GetAllMythologyQuestions()
        {
            return new List<Question>
            {
                // Vietnamese Mythology
                new Question
                {
                    Text = "Trong thần thoại Việt Nam, vị thần nào tạo nên vũ trụ?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Thần trụ trời" },
                        new Answer { Text = "Thần Lúa" },
                        new Answer { Text = "Thần Nông" },
                        new Answer { Text = "Mười hai bà mụ" }
                    },
                    CorrectAnswer = "Thần trụ trời",
                    Category = QuestionCategory.VietnameseMythology
                },
                new Question
                {
                    Text = "Trong thần thoại Việt Nam, vị thần khai thiên lập địa đã tạo ra thế gian bằng cách nào?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Sinh ra thần Đất Mẹ Gaia - một vị thần vô cùng phì nhiêu, cường thịnh, thần đã đem sự sống đến cho muôn loài ngay trên cơ thể mình." },
                        new Answer { Text = "Thần dùng tay nâng nửa Trái Đất trên lên tạo thành bầu trời, dùng chân đạp chống đỡ nửa dưới Trái Đất xuống thành mặt đất." },
                        new Answer { Text = "Thần đứng dậy, ngẩng đầu đội trời lên, rồi tự mình đào đất, đập đá, đắp thành một cái cột vừa cao, vừa to để chống trời." },
                        new Answer { Text = "Trời cha chung sống với Đất mẹ bằng những hạt mưa từ trên trời rơi xuống thấm sâu vào lòng đất. Từ đó, cây cỏ mọc lên và muôn vật sinh sôi nảy nở." }
                    },
                    CorrectAnswer = "Thần đứng dậy, ngẩng đầu đội trời lên, rồi tự mình đào đất, đập đá, đắp thành một cái cột vừa cao, vừa to để chống trời.",
                    Category = QuestionCategory.VietnameseMythology
                },
                new Question
                {
                    Text = "Trong thần thoại Việt Nam, con người giải thích vũ trụ các hiện tượng tự nhiên thông qua các vị thần nào?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Ông Trời, Mười hai bà mụ, Nữ Oa - Tứ Tượng, Lạc Long Quân - Âu Cơ,..." },
                        new Answer { Text = "Thần trụ trời, Ông Trời, Thần Sét, Mặt trời, Thần Mưa,..." },
                        new Answer { Text = "Sơn Tinh - Thủy Tinh, Chử Đồng Tử, Thánh Gióng, Tản Viên,..." },
                        new Answer { Text = "Cóc kiện trời, Thần Lúa, Sơn Tinh - Thủy Tinh,..." }
                    },
                    CorrectAnswer = "Thần trụ trời, Ông Trời, Thần Sét, Mặt trời, Thần Mưa,...",
                    Category = QuestionCategory.VietnameseMythology
                },
                new Question
                {
                    Text = "Theo văn bản Thần Trụ Trời, vì sao mặt đất ngày nay không bằng phẳng mà có chỗ lồi, chỗ lõm?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Do sự kiến tạo của Trái Đất" },
                        new Answer { Text = "Do thần phá cột trụ trời đi, lấy đất đá ném tung khắp nơi" },
                        new Answer { Text = "Do chiếc trụ trời bị gãy" },
                        new Answer { Text = "Do cuộc chiến giữa các vị thần" }
                    },
                    CorrectAnswer = "Do thần phá cột trụ trời đi, lấy đất đá ném tung khắp nơi",
                    Category = QuestionCategory.VietnameseMythology
                },

                // Chinese Mythology
                new Question
                {
                    Text = "Theo thần thoại Trung Quốc, vị thần nào có công khai thiên lập địa?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Thần Nữ Oa" },
                        new Answer { Text = "Thần Bàn Cổ" },
                        new Answer { Text = "Thần Cự Linh" },
                        new Answer { Text = "Thần Viêm Đế" }
                    },
                    CorrectAnswer = "Thần Bàn Cổ",
                    Category = QuestionCategory.ChineseMythology
                },
                new Question
                {
                    Text = "Theo thần thoại Trung Quốc, vị thần nào có công tạo ra loài người?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Nữ Oa" },
                        new Answer { Text = "Thiên Hậu Thánh Mẫu" },
                        new Answer { Text = "Ngọc Hoàng Thượng Đế" },
                        new Answer { Text = "Nguyên Thủy Thiên Tôn" }
                    },
                    CorrectAnswer = "Nữ Oa",
                    Category = QuestionCategory.ChineseMythology
                },
                new Question
                {
                    Text = "Theo thần thoại Trung Quốc, loài người được tạo ra từ đâu?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Từ đất ở sông Hằng" },
                        new Answer { Text = "Từ đất ở sông Nile" },
                        new Answer { Text = "Từ đất ở sông Hoàng Hà" },
                        new Answer { Text = "Từ đất ở sông Amazon" }
                    },
                    CorrectAnswer = "Từ đất ở sông Hoàng Hà",
                    Category = QuestionCategory.ChineseMythology
                },
                new Question
                {
                    Text = "Theo thần thoại Trung Quốc, thần sáng chế đã tạo ra thế gian bằng cách nào?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Vạn vật tự sinh nổi, nảy nở" },
                        new Answer { Text = "Sự hóa thân của chính thần linh" },
                        new Answer { Text = "Sinh ra từ cơ thể Đất Mẹ" },
                        new Answer { Text = "Được nhào nặn từ đất và nước" }
                    },
                    CorrectAnswer = "Được nhào nặn từ đất và nước",
                    Category = QuestionCategory.ChineseMythology
                },

                // Indian Mythology
                new Question
                {
                    Text = "Theo thần thoại Ấn Độ, vị thần nào là thần sáng tạo?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Thần Brahma" },
                        new Answer { Text = "Thần Vishnu" },
                        new Answer { Text = "Thần Shiva" },
                        new Answer { Text = "Thần Indra" }
                    },
                    CorrectAnswer = "Thần Brahma",
                    Category = QuestionCategory.IndianMythology
                },
                new Question
                {
                    Text = "Trong các vị thần sau, vị thần nào được xem là thủy tổ loài người?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Visuakacma" },
                        new Answer { Text = "Manu" },
                        new Answer { Text = "Purusa" },
                        new Answer { Text = "Tất cả đáp án trên đều đúng" }
                    },
                    CorrectAnswer = "Tất cả đáp án trên đều đúng",
                    Category = QuestionCategory.IndianMythology
                },
                new Question
                {
                    Text = "Theo Ấn Độ giáo, vị thần nào là Thần Lửa?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Vayu" },
                        new Answer { Text = "Indra" },
                        new Answer { Text = "Agni" },
                        new Answer { Text = "Surya" }
                    },
                    CorrectAnswer = "Agni",
                    Category = QuestionCategory.IndianMythology
                },
                new Question
                {
                    Text = "Theo thần thoại Ấn Độ, Tam thần Ấn giáo gồm những vị thần nào?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Brahma, Vishnu, Shiva" },
                        new Answer { Text = "Brahma, Vishnu, Saraswati" },
                        new Answer { Text = "Lakshmi, Vishnu, Shiva" },
                        new Answer { Text = "Brahma, Kali, Saraswati" }
                    },
                    CorrectAnswer = "Brahma, Vishnu, Shiva",
                    Category = QuestionCategory.IndianMythology
                },

                // Greek Mythology
                new Question
                {
                    Text = "Theo thần thoại Hy Lạp, vị thần nào nhận trách nhiệm tạo ra loài người?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Nữ thần Eros" },
                        new Answer { Text = "Epimete và Promete" },
                        new Answer { Text = "Nữ thần Athena" },
                        new Answer { Text = "Nữ thần Demeter" }
                    },
                    CorrectAnswer = "Epimete và Promete",
                    Category = QuestionCategory.GreekMythology
                },
                new Question
                {
                    Text = "Theo thần thoại Hy Lạp, con người được tạo ra bằng cách nào?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Sự hóa thân của chính thần linh" },
                        new Answer { Text = "Sự nhào nặn của thần linh từ đất và nước" },
                        new Answer { Text = "Sự sinh ra của thần Đất" },
                        new Answer { Text = "Sự sinh ra của thần Trời" }
                    },
                    CorrectAnswer = "Sự nhào nặn của thần linh từ đất và nước",
                    Category = QuestionCategory.GreekMythology
                },
                new Question
                {
                    Text = "Theo thần thoại Hy Lạp, “vũ khí” để loài người mạnh hơn các loài khác là gì?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Có sức mạnh của các vị thần" },
                        new Answer { Text = "Có trí tuệ phi thường" },
                        new Answer { Text = "Có ngọn lửa của sự văn minh" },
                        new Answer { Text = "Có sức mạnh của muôn loài" }
                    },
                    CorrectAnswer = "Có ngọn lửa của sự văn minh",
                    Category = QuestionCategory.GreekMythology
                },
                new Question
                {
                    Text = "Vị thần nào đã “làm cho con người đứng thẳng lên, đi bằng hai chân để hai tay có thể thảnh thơi làm nhiều việc khác?",
                    Answers = new List<Answer>
                    {
                        new Answer { Text = "Thần Ares" },
                        new Answer { Text = "Thần Ra" },
                        new Answer { Text = "Thần Loki" },
                        new Answer { Text = "Thần Promete" }
                    },
                    CorrectAnswer = "Thần Promete",
                    Category = QuestionCategory.GreekMythology
                }
            };
        }
    }
}
