using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LearninASP_.NET_.Models
{
    public class Directory
    {
        public int ID { get; set; }
        public int ParentID { get; set; }
        public string name { get; set; }
        public bool isFilm { get; set; }
        public string path { get; set; }
    }
}