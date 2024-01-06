using FirePlace.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace FirePlace
{
    public class FirePlaceDbContext : DbContext
    {
        public FirePlaceDbContext(DbContextOptions<FirePlaceDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
