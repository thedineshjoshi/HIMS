using HIMS.DTO.Appointment;
using HIMS.Interfaces;
using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Enums;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HIMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
        // GET: api/<AppointmentController>
        [HttpGet]
        public async Task<IActionResult> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        // GET api/<AppointmentController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentByIdAsync(Guid id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null) return NotFound("Appointment not found");
            return Ok(appointment);
        }

        [HttpPost("check-patient")]
        public async Task<IActionResult> CheckPatient([FromBody] PatientCheckDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var patient = await _appointmentService.CheckPatientExistsAsync(dto);
            if (patient != null)
                return Ok(new { exists = true, patientId = patient.Id });
            else
                return Ok(new { exists = false });
        }



        // POST api/<AppointmentController>
        [HttpPost]
        public async Task<IActionResult> AddAppointmentAsync([FromBody] CreateAppointmentDto requestAppointment)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appointment = await _appointmentService.AddAppointmentAsync(requestAppointment);
            return Ok();
        }

        // PUT api/<AppointmentController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromQuery] AppointmentStatus_Enum status)
        {
            var updated = await _appointmentService.UpdateAppointmentAsync(id, status);
            if (!updated) return NotFound("Appointment not found");
            return NoContent();
        }

        // DELETE api/<AppointmentController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _appointmentService.DeleteAppointmentAsync(id);
            if (!deleted) return NotFound("Appointment not found");
            return NoContent();
        }
    }
}
