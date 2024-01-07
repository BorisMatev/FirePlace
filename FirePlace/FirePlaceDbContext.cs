using FirePlace.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace FirePlace
{
    public class FirePlaceDbContext : DbContext
    {
        public FirePlaceDbContext(){}
        public FirePlaceDbContext(DbContextOptions<FirePlaceDbContext> options)
            : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Category> Categories { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Photo>()
                .HasOne(p => p.User)
                .WithMany(u => u.Photos)
                .HasForeignKey(p => p.UserId)
                .IsRequired();

            base.OnModelCreating(modelBuilder);
        }
    }
}
