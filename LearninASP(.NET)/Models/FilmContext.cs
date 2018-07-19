using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace LearninASP_.NET_.Models
{
    public class FilmContext : DbContext
    {
        public DbSet<Directory> Directories { get; set; }
    }
}