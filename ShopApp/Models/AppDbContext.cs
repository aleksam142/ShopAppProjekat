using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ShopApp.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Seller> Sellers { get; set; }
        public DbSet<Shop> Shops { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Shop>().HasData(
                new Shop() { Id = 1, Name = "Lidl", Address = "Bulevar vojvode Stepe 2" },
                new Shop() { Id = 2, Name = "Univerexport", Address = "Futoski put 93c" },
                new Shop() { Id = 3, Name = "Idea", Address = "Bulevar vojvode Stepe 32" }
            );

            modelBuilder.Entity<Seller>().HasData(
                new Seller()
                {
                    Id = 1,
                    Name = "Marko",
                    Surname = "Markovic",
                    Year = 1987,
                    ShopId = 2
                },
                new Seller()
                {
                    Id = 2,
                    Name = "Milica",
                    Surname = "Milic",
                    Year = 1990,
                    ShopId = 1
                },
                new Seller()
                {
                    Id = 3,
                    Name = "Petar",
                    Surname = "Petrovic",
                    Year = 1974,
                    ShopId = 3
                },
                new Seller()
                {
                    Id = 4,
                    Name = "Luka",
                    Surname = "Lukic",
                    Year = 1997,
                    ShopId = 1
                }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
