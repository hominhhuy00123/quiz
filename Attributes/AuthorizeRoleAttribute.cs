using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Quiz.Data;
using Quiz.Enumerations;
using System.Linq;

public class AuthorizeRoleAttribute : ActionFilterAttribute
{
    private readonly UserRole[] _roles;

    public AuthorizeRoleAttribute(params UserRole[] roles)
    {
        _roles = roles;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        // Retrieve user info from session
        var userId = context.HttpContext.Session.GetString("UserId");
        if (userId == null)
        {
            context.Result = new UnauthorizedResult(); // Return 401 if no user is logged in
            return;
        }

        // Retrieve user information from database
        var dbContext = (ApplicationDbContext)context.HttpContext.RequestServices.GetService(typeof(ApplicationDbContext));
        var user = dbContext.Users.Find(int.Parse(userId));

        // Check if the user role is allowed
        if (user == null || !_roles.Contains(user.Role))
        {
            context.Result = new UnauthorizedResult(); // Return 401 if the user role doesn't match
        }
    }
}
