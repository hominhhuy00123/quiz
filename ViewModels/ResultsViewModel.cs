using Quiz.Models;
using System.Collections.Generic;

public class SubmitAnswersRequest
{
    public string Code { get; set; }
    public int? UserId { get; set; }
    public string PlayerName { get; set; }
    public List<QuestionAnswer> Answers { get; set; }
    public string Category { get; set; } // New property for category
}