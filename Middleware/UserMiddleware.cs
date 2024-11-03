using Microsoft.AspNetCore.Http;
using Quiz.Data;
using System.Threading.Tasks;

public class UserMiddleware
{
    private readonly RequestDelegate _next;

    public UserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        // Check if session contains a logged-in user
        var userId = context.Session.GetString("UserId");
        if (!string.IsNullOrEmpty(userId))
        {
            // Fetch user from database
            var user = dbContext.Users.Find(int.Parse(userId));

            // Add user to HttpContext.Items
            context.Items["User"] = user;
        }

        // Call the next middleware in the pipeline
        await _next(context);
    }
}
