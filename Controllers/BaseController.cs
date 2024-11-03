
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Matcha.Home.Controllers
{
    /// <summary>
    /// Base controller
    /// </summary>
    public class BaseController : Controller
    {
        public bool IsAdmin
        {
            get
            {
                return HttpContext.Session.GetString("Role") == "Admin";
            }
        }

        // Override OnActionExecuting to set ViewBag.IsAdmin for every view
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);

            // Set ViewBag.IsAdmin for all views
            ViewBag.IsAdmin = IsAdmin;
        }
    }
}