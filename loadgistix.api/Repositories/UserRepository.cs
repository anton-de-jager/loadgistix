using System.Threading.Tasks;
using loadgistix.api.Auth;
using loadgistix.api.Models;
using Microsoft.EntityFrameworkCore;

namespace loadgistix.api.Repositories
{
    public interface IUserRepository
    {
        Task UpdateResetToken(string email, string resetToken);
        Task<ApplicationUser> GetUserByResetTokenAsync(string resetToken);
        Task UpdateUserAsync(ApplicationUser user);
    }

    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task UpdateResetToken(string email, string resetToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                user.ResetToken = resetToken;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ApplicationUser> GetUserByResetTokenAsync(string resetToken)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == resetToken);
        }

        public async Task UpdateUserAsync(ApplicationUser user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
