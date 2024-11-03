namespace Quiz.Hubs
{
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Threading.Tasks;

    public class GameHub : Hub
    {
        public async Task UpdateScores(string code, string player, int score)
        {
            // Notify all clients about the updated score
            await Clients.Group(code).SendAsync("ReceiveScoreUpdate", player, score);
        }

        public async Task JoinGameGroup(string code, string playerName)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, code);
                await NotifyNewPlayerJoined(code, playerName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in JoinGameGroup: {ex.Message}");
                throw; // Rethrow the error to trigger client-side error handling
            }
        }

        public Task LeaveGameGroup(string code)
        {
            // Remove the client from the game group
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, code);
        }

        // New method to notify about a new player joining
        public async Task NotifyNewPlayerJoined(string code, string playerName)
        {
            // Notify all clients in the group about the new player
            // Notify players in the game group
            await Clients.Group(code).SendAsync("NewPlayerJoined", playerName);

            // Notify stats viewers if required
            await Clients.Group($"{code}-stats").SendAsync("NewPlayerJoinedStats", playerName);
        }

        public async Task JoinStatisticsGroup(string code)
        {
            // Add the client to the statistics-specific group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"{code}-stats");
        }

        public async Task NotifyPlayerSubmitted(string code, string playerName, string category)
        {
            // Notify all clients in the game group about the submission
            await Clients.Group(code).SendAsync("PlayerSubmitted", playerName, category);
        }
        public async Task NotifyPlayerCompletedCategory(string code, string playerName, string category)
        {
            await Clients.Group(code).SendAsync("PlayerCompletedCategory", playerName, category);
        }
    }
}
