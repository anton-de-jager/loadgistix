using loadgistix.api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace loadgistix.api.Auth
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .Property(e => e.Name)
            .HasMaxLength(250);

            builder.Entity<ApplicationUser>()
                .Property(e => e.Company)
                .HasMaxLength(250);

            builder.Entity<ApplicationUser>()
                .Property(e => e.Avatar)
                .HasMaxLength(250);

            builder.Entity<ApplicationUser>()
                .Property(e => e.Status)
                .HasMaxLength(250);

            builder.Entity<ApplicationUser>()
                .Property(e => e.ResetToken)
                .HasMaxLength(250);
        }
    }
}
