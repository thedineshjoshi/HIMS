using HIMS.Data;
using HIMS.Interfaces;
using HIMS.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace HIMS.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddHIMSServices( this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IStaffService, StaffService>();
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<ILoginService, LoginService>();
            return services;
        }
    }
}
