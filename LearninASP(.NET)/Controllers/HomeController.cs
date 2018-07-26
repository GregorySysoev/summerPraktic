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
            if (0 != parId)
            {
                var dropZone = db.Directories.Where(c => c.ID == parId).First();
                if (dropZone.isFilm == false)
                {
                    var dragId = db.Directories.Where(c => c.ID == id).First();
                    dragId.ParentID = parId;
                    db.SaveChanges();
                    return true;
                }
                else return false;
            } else
            {
                var dragId = db.Directories.Where(c => c.ID == id).First();
                dragId.ParentID = 0;
                db.SaveChanges();
                return true;
            }
        }

        [HttpPost]
        public bool DeleteElem (int id)
        {
            Directory deleteElem = db.Directories.Find(id);
            if (null != deleteElem)
            {
                if (false == deleteElem.isFilm) recursiveDelete(id);
                void recursiveDelete(int parId)
                {
                    var dropZone = db.Directories.Where(c => c.ParentID == parId).ToList();
                    if (!dropZone.Equals(null))
                    {
                        foreach (var b in dropZone)
                        {
                            if (false == b.isFilm) recursiveDelete(b.ID);
                            db.Directories.Remove(b);
                        }
                    }
                }
                db.Directories.Remove(deleteElem);
                db.SaveChanges();
                return true;
            }
            else return false;
        }

        [HttpPost]
        public void renameElement(int id, string newName)
        {
            var needToRename = db.Directories.Where(c => c.ID == id).First();
            needToRename.name = newName;
            db.SaveChanges();
        }

        [HttpPost]
        public JsonResult CreateNewDir (string newDirName)
        {
            Directory newDir = new Directory
            {
                ParentID = 0,
                name = newDirName,
                isFilm = false,
                path = null
            };
            db.Directories.Add(newDir);
            db.SaveChanges();

            return Json(newDir, JsonRequestBehavior.AllowGet);
        }
    }
}