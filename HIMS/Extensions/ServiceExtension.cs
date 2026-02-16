using HIMS.Interfaces;
using HIMS.Services;

namespace HIMS.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddHIMSServices( this IServiceCollection services)
        {
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IStaffService, StaffService>();
            return services;
        }
    }
}
