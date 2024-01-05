using Microsoft.EntityFrameworkCore;

namespace FirePlace
{
    public class FirePlaceDbContext : DbContext
    {
        public FirePlaceDbContext(DbContextOptions<FirePlaceDbContext> options)
            : base(options)
        {
        }
        //public DbSet<User> User { get; set; }
        //public DbSet<Image> Images { get; set; }
    }
}
