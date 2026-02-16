using HIMS.Data;
using HIMS.DTO.Pagination;
using HIMS.DTO.Response;
using HIMS.DTO.Staff;
using HIMS.Interfaces;
using HIMS.Model.Core_People_Entities;
using HIMS.Model.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Data;
using System.Net;
using System.Reflection;

namespace HIMS.Services
{
    public class StaffService : IStaffService
    {
        private readonly ApplicationDbContext db;
        public StaffService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<PagedResponseDto<GetStaffDto>> GetAllStaffAsync(PagingRequestDto request)
        {
            var query = db.Staffs.Where(s => s.IsActive);
            var totalRecords = await query.CountAsync();
            var requestedStaffs = await query
        .OrderBy(s => s.FirstName) // Optional: always order for consistent paging
        .Skip((request.PageNumber - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(s => new GetStaffDto
        {
            Id = s.Id,
            FirstName = s.FirstName,
            MiddleName = s.MiddleName,
            LastName = s.LastName,
            Address = s.Address,
            ContactNumber = s.ContactNumber,
            Email = s.Email,
            DateOfBirth = s.DateOfBirth,
            Salutation = s.Salutation,
            Role = s.Role,
            HiringDate = s.HiringDate,
            Salary = s.Salary,
            Gender = s.Gender,
            CreatedOn = s.CreatedOn,
            UpdatedOn = s.UpdatedOn
        })
        .ToListAsync();
            var response = new PagedResponseDto<GetStaffDto>
            {
                Items = requestedStaffs,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords
            };
            return response;
        }

        public async Task<GetStaffDto> GetStaffByIdAsync(Guid id)
        {
            var requestedStaff = await db.Staffs.Where(s => s.Id == id && s.IsActive==true).Select(s => new GetStaffDto
            {
                Id = s.Id,
                FirstName = s.FirstName,
                MiddleName = s.MiddleName,
                LastName = s.LastName,
                Address = s.Address,
                ContactNumber = s.ContactNumber,
                Gender = s.Gender,
                Email = s.Email,
                DateOfBirth = s.DateOfBirth,
                Salutation = s.Salutation,
                Role = s.Role,
                HiringDate = s.HiringDate,
                Salary = s.Salary,
                CreatedOn = s.CreatedOn,
                UpdatedOn = s.UpdatedOn
            }).FirstOrDefaultAsync();
            if(requestedStaff == null)
            {
                return null;
            }
            return requestedStaff;
        }

        public async Task<CreateStaffResponseDto> AddStaffAsync(CreateStaffDto staff)
        {
            var newStaff = new Staff
            {
                Id = Guid.NewGuid(),
                FirstName = staff.FirstName,
                MiddleName = staff.MiddleName,
                LastName = staff.LastName,
                Gender = staff.Gender,
                Address = staff.Address,
                ContactNumber = staff.ContactNumber,
                Email = staff.Email,
                DateOfBirth = staff.DateOfBirth,
                Salutation = staff.Salutation,
                Role = staff.Role,
                HiringDate = staff.HiringDate,
                Salary = staff.Salary,
                IsActive = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = staff.CreatedBy
            };

            await db.Staffs.AddAsync(newStaff);
            Guid? doctorId = null;

            if (staff.Role == Role_Enum.Doctor)
            {
                var newDoctor = new Doctor
                {
                    Id = Guid.NewGuid(),
                    FirstName = staff.FirstName,
                    MiddleName = staff.MiddleName,
                    LastName = staff.LastName,
                    Gender = staff.Gender,
                    Address = staff.Address,
                    ContactNumber = staff.ContactNumber,
                    Email = staff.Email,
                    DateOfBirth = staff.DateOfBirth,
                    HiringDate = staff.HiringDate,
                    Salary = staff.Salary,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = staff.CreatedBy
                };
                doctorId = newDoctor.Id;
                await db.Doctors.AddAsync(newDoctor);
            }

            await db.SaveChangesAsync();
            if (doctorId != null)
            {
                return new CreateStaffResponseDto
                {
                    StaffId = newStaff.Id,
                    DoctorId = doctorId
                };
            }
            else
            {
                return new CreateStaffResponseDto
                {
                    StaffId = newStaff.Id
                };
            }
        }

        public async Task<ResponseDto>UpdateStaffAsync(Guid id, UpdateStaffDto staff)
        {
            var existingStaff = await db.Staffs.FindAsync(id);
            if (existingStaff == null)
            {
                return new ResponseDto
                {
                    Success = false,
                    Message = "Staff not found"
                };
            }
            existingStaff.FirstName = staff.FirstName;
            existingStaff.MiddleName = staff.MiddleName;
            existingStaff.LastName = staff.LastName;
            existingStaff.Gender = staff.Gender;
            existingStaff.Address = staff.Address;
            existingStaff.ContactNumber = staff.ContactNumber;
            existingStaff.Email = staff.Email;
            existingStaff.DateOfBirth = staff.DateOfBirth;
            existingStaff.Salutation = staff.Salutation;
            existingStaff.Role = staff.Role;
            existingStaff.HiringDate = staff.HiringDate;
            existingStaff.Salary = staff.Salary;
            existingStaff.UpdatedBy = staff.UpdatedBy;
            existingStaff.UpdatedOn = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return new ResponseDto
            {
                Success = true,
                Message = "Staff Updated Successfully"
            };
        }

        public async Task<ResponseDto> DeleteStaffAsync(Guid id)
        {
                var existingStaff = await db.Staffs.Where(s => s.Id == id && s.IsActive == true).FirstOrDefaultAsync();
                if (existingStaff == null)
                {
                    return new ResponseDto
                    {
                        Success = false,
                        Message = "Staff not found"
                    };
                }
                existingStaff.IsActive = false;
                existingStaff.UpdatedOn = DateTime.UtcNow;
                await db.SaveChangesAsync();
                return new ResponseDto
                {
                    Success = true,
                    Message = "Staff Deleted Successfully"
                };
        }

    }
}
