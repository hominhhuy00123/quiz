using Quiz.Enumerations;
using Quiz.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

public class PlayerScore
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public Game Game { get; set; }

    // Nếu là người chơi đăng ký thì dùng User, nếu không thì dùng PlayerName cho người chơi khách
    public int? UserId { get; set; }
    public User User { get; set; }
    public string PlayerName { get; set; } // Thêm thuộc tính này cho người chơi khách

    public double TotalScore { get; set; }

    // Không ánh xạ CategoryScores vào DB trực tiếp
    [NotMapped]
    public Dictionary<QuestionCategory, int> CategoryScores
    {
        get
        {
            return string.IsNullOrEmpty(CategoryScoresJson)
                ? new Dictionary<QuestionCategory, int>()
                : JsonSerializer.Deserialize<Dictionary<QuestionCategory, int>>(CategoryScoresJson);
        }
        set
        {
            CategoryScoresJson = JsonSerializer.Serialize(value);
        }
    }

    // Thuộc tính JSON để lưu trữ trong cơ sở dữ liệu
    public string CategoryScoresJson { get; set; }
}
