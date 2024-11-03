using Quiz.Enumerations;
using System.Collections.Generic;

public class ResultsViewModel
{
    public string GameCode { get; set; }
    public int TotalScore { get; set; }
    public Dictionary<QuestionCategory, int> CategoryScores { get; set; }
}
