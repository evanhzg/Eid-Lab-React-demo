# unpaws

**Paw now, soar later!**

**unpaws** is an innovative app designed to match students with companies for apprenticeships and internships. Our goal is to help students gain hands-on experience and kickstart their careers.

## About the App

unpaws connects ambitious students with exciting opportunities in various industries. By facilitating these connections, we aim to:

- Provide students with real-world work experience
- Help companies find fresh talent
- Bridge the gap between academic learning and professional skills
- Give a platform Student-focused to help them in a difficult time of searching

Our mascot, a clever and curious raccoon, represents the spirit of exploration and adaptability that we encourage in our users. (Might exist one day, might never see the light. Nobody knows!)

# Student Apprenticeship Job-Board

This project is a basic React SaaS application for managing a fictive students apprenticeship job-board. It provides :

- An admin dashboard to manage student/professionals profiles, job listings, and company information.
- A user-focused application to find, post, candidate and chat about opportunities (WIP)

## Technologies Used

- React
- Next.js (public app)
- TypeScript
- Material-UI (admin, getting rid of)
- Axios for API calls
- React Router for navigation
- Vite as the build tool and development server (admin)
- Docker for containerization
- Nginx for reverse proxy
- mongodb for Databases
- node.js Express for the api definitions and routing

### Potential Future Technologies

- Jest and React Testing Library for unit and integration testing
- Cypress for end-to-end testing
- Storybook for component documentation and testing
- React Query for efficient data fetching and caching
- Firebase or AWS Amplify for authentication and backend services (not sure yet)

## Features

### Current Features

- Admin
  - Student profile management (CRUD operations)
  - Responsive table with filtering, sorting and pagination
  - Search functionality for tables
  - Responsive layout
  - Themes : Light / Dark mode
- Public App
  - Offer listings
  - Card components
  - Searching & filtering
  - Responsive layout
  - Themes : Light / Dark mode

### Potential Future Features

- Company/Student frontend profile management
- Job listing creation and management
- Application tracking system
- Matching algorithm for students and job listings
- Reporting and analytics dashboard
- User authentication and role-based access control
- Messaging system between students and companies + Support
- Resume builder for students
- Interview scheduling tool

## Roadmap

1. Complete admin dashboard functionality
2. Develop user-facing applications for students and companies
3. Implement authentication and authorization
4. Create job listing and application management features
5. Develop matching algorithm
6. Add messaging system
7. Implement analytics and reporting
8. Enhance UI/UX based on user feedback
9. Optimize performance and scalability
10. Implement additional features based on user needs

// Not actual, got to update this part (16/09/24)

## Technical Steps

1. Set up project structure and core dependencies
2. Implement basic CRUD operations for student profiles
3. Create responsive UI components
4. Implement sorting, pagination, and search functionality
5. Set up API integration
6. Implement state management solution
7. Add user authentication and authorization
8. Develop company and job listing management features
9. Create matching algorithm
10. Implement messaging system
11. Add analytics and reporting features
12. Optimize performance and implement caching strategies
13. Set up testing infrastructure and write tests

// Not actual, got to update this part (16/09/24)

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/evanhzg/unpaws.git
   cd unpaws
   ```

2. Add the following entries to your `/etc/hosts` file to set up reverse proxies:

   ```
   127.0.0.1 unpaws.loc
   127.0.0.1 admin.unpaws.loc
   127.0.0.1 api.unpaws.loc
   ```

3. Start the Docker containers:

   ```bash
   docker-compose up --build
   ```

4. Open your browser and navigate to:
   - Admin Dashboard: [http://admin.unpaws.loc](http://admin.unpaws.loc)
   - Public App: [http://unpaws.loc](http://unpaws.loc)
   - API: [http://api.unpaws.loc](http://api.unpaws.loc)

## Learning Resources

I am using this project to learn React faster. It is not intended for production use anytime in the future. Here are some of the resources I use to learn:

- [Cursor AI](https://www.cursor.so/)
- [LinkedIn Learning courses](https://www.linkedin.com/learning/)
- [freeCodeCamp](https://www.freecodecamp.org/)
- [StackOverflow](https://stackoverflow.com/)

## Tools

- Icons are from [Iconify](https://iconify.design/)
- I use [Zen Browser](https://zenbrowser.com/), which is very clean and compact.

## About Me

I am Evan Hoizey, and **_I am looking for an apprenticeship in Lyon_**, Auvergne-Rhône-Alpes, France.

## Contributing

Just me, for now.

## License

No license as of now.
