using FluentValidation;
using HIMS.DTO.Appointment;

namespace HIMS.Validators.Appointment
{
    public class CreateAppointmentValidator:AbstractValidator<CreateAppointmentDto>
    {
        public CreateAppointmentValidator()
        {
            
            RuleFor(a => a.AppointmentDate)
                .GreaterThan(DateTime.Now)
                .WithMessage("Appointment date must be in the future.");
            RuleFor(a => a.ReasonForVisit)
                .NotEmpty()
                .WithMessage("Reason for visit is required.")
                .MaximumLength(500)
                .WithMessage("Reason for visit cannot exceed 500 characters.");
            RuleFor(a => a.DoctorId)
                .NotEmpty()
                .WithMessage("Doctor ID is required.");
        }
    }
}
