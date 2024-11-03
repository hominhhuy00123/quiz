using System.Collections.Generic;

namespace Quiz.ViewModels
{
    public class GameStatistics
    {
        public string GameCode { get; set; }
        public string Title { get; set; }
        public List<PlayerScore> Players { get; set; } // Players in the game
    }

    public class StatisticsViewModel
    {
        public List<GameStatistics> Games { get; set; }
    }
}