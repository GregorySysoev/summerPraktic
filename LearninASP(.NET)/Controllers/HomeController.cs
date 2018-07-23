using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LearninASP_.NET_.Models;

namespace LearninASP_.NET_.Controllers
{
    public class HomeController : Controller
    {
        FilmContext db = new FilmContext();

        public ActionResult Index()
        {
            IEnumerable<Directory> directories = db.Directories;
            ViewBag.directories = directories.Where(a => a.ParentID.Equals(0));
            return View();
        }

        [HttpGet]
        public JsonResult GetChildren(int id)
        {
            var shell = new
            {
                Id = id,
                Directories = db.Directories.Where(a => a.ParentID.Equals(id)).ToList()
            };
            return Json(shell, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public bool ChangeDir(int id, int parId)
        {
            var dropZone = db.Directories.Where(c => c.ID == parId).First();
            if (dropZone.isFilm == false) {
                var dragId = db.Directories.Where(c => c.ID == id).First();
                dragId.ParentID = parId;
                db.SaveChanges();
                return true;
            } else
            {
                return false;
            }
        }
    }
}