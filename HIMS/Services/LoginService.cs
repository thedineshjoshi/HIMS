using HIMS.Data;
using HIMS.DTO.Authentication;
using HIMS.Interfaces;
using HIMS.Model.Core_People_Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HIMS.Services
{
    public class LoginService:ILoginService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Staffs.FirstOrDefaultAsync(s => s.Username == request.Username && s.IsActive);
            if (user == null)
            {
                throw new Exception("Invalid username or password.");
            }
            var passwordHasher = new PasswordHasher<Staff>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Invalid username or password.");
            }
            var authClaims = new List<Claim>
                 {
                     new Claim("UserName",user.Username),
                     new Claim("UserId",user.Id.ToString()),
                     new Claim("Role",user.Role.ToString())
                 };
            var secret = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(secret))
            {
                throw new Exception("JWT Secret is not configured properly.");
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:ValidIssuer"],
                audience: _configuration["Jwt:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            return new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Username = user.Username,
                Role = user.Role.ToString(),
                Expiration = token.ValidTo
            };

        }
    }
}
