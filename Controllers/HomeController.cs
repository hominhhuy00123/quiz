using Matcha.Home.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Quiz.Controllers
{
    public class HomeController : BaseController
    {
        public IActionResult Index()
        {
            ViewBag.IsAdmin = IsAdmin;
            return View();
        }
    }

}
