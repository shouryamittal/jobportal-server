Models:
    - User - Table to store user information
    - Job  - Table to store Job Informaiton
    - Skill - Table to store list of available skills
    - Job_SKill - Lookup table to store references of Job and its corresponding skills
    - Job_ Activity - Lookup table to store references of a candidate (User) and the job he has applied to.

Routes:
 -USER
    - POST /api/user/login - input --> username, password  - output --> token
    - POST /api/user/signup - input --> name, password, email, type - output --> token 
    - GET /api/user/:userId/jobs - input --> userId, output --> all jobs

 -JOB
    - POST /api/job/ - input --> job details, userId 
    - GET /api/job/:jobId - input --> jobId, output --> job details
    - GET /api/job/:jobId/candidates - input --> jobId, output --> list of candidates
    - POST /api/job/apply - input --> userId, jobId
    - GET /api/job/search - input --> search query, type, output --> set of jobs
