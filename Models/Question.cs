using Quiz.Enumerations;
using System.Collections.Generic;

namespace Quiz.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public QuestionCategory Category { get; set; }
        public List<Answer> Answers { get; set; }
        public string CorrectAnswer { get; set; }
    }

}
