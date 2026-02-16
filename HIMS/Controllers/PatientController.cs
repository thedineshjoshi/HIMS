using HIMS.DTO.Patient;
using HIMS.Interfaces;
using HIMS.Model.Core_People_Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HIMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }
        // GET: api/<PatientController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
                var patients = await _patientService.GetAllPatientsAsync();
                return Ok(patients);
        }

        // GET api/<PatientController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
                var patient = await _patientService.GetPatientByIdAsync(id);

                if (patient == null)
                    return NotFound($"Patient with ID {id} not found.");

                return Ok(patient);
            
        }

        // POST api/<PatientController>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePatientDto dto)
        {
                var createdPatient = await _patientService.AddPatientAsync(dto);
                return Ok(createdPatient);
        }

        // PUT api/<PatientController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePatientDto dto)
        {
            var updatedPatient = await _patientService.UpdatePatientAsync(id, dto);
                return Ok(updatedPatient);
        }

        // DELETE api/<PatientController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
                var deleted = await _patientService.DeletePatientAsync(id);
                return Ok(deleted);
        }
    }
}
