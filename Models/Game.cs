using System.Collections.Generic;

namespace Quiz.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public List<Question> Questions { get; set; }

        // Foreign key to the User who created the game
        public int? CreatedByUserId { get; set; } // Nullable if you allow it
        public User CreatedBy { get; set; } // Navigation property to the User who created the game
    }


}
