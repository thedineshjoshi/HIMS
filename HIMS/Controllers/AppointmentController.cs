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
            return Ok(appointment);
        }

        [HttpGet("check-patient")]
        public async Task<IActionResult> CheckPatient([FromQuery] PatientCheckDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var patient = await _appointmentService.CheckPatientExistsAsync(dto);
            return Ok(patient);
        }

        // POST api/<AppointmentController>
        [HttpPost]
        public async Task<IActionResult> AddAppointmentAsync([FromBody] CreateAppointmentDto requestAppointment)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appointment = await _appointmentService.AddAppointmentAsync(requestAppointment);
            return Ok(appointment);
        }

        // PUT api/<AppointmentController>/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromQuery] AppointmentStatus_Enum status)
        {
            var updated = await _appointmentService.UpdateAppointmentAsync(id, status);
            return Ok(updated);
        }

        // DELETE api/<AppointmentController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _appointmentService.DeleteAppointmentAsync(id);
            return Ok(deleted);
        }
    }
}
