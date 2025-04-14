import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle } from 'lucide-react';
import './projectscomponent.css';

const ProjectsComponent = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([
        { id: 1, name: 'Twitter Clone', description: 'A clone of the Twitter platform with basic functionalities' },
        { id: 2, name: 'E-commerce App', description: 'An online shopping application with cart and checkout features' },
        { id: 3, name: 'Weather App', description: 'An application to check weather forecasts for different locations' },
        { id: 4, name: 'Task Manager', description: 'A simple task management tool with drag-and-drop functionality' }
    ]);

    const [completedProjects, setCompletedProjects] = useState([]);

    // Load completed projects from localStorage
    useEffect(() => {
        const savedCompletedProjects = JSON.parse(localStorage.getItem('completedProjects') || '[]');
        setCompletedProjects(savedCompletedProjects);
    }, []);

    const handleProjectClick = (projectName) => {
        navigate(`/project/${projectName}`);
    };

    const isProjectCompleted = (projectName) => {
        return completedProjects.includes(projectName);
    };

    return (
        <div className="projects-component">
            <div className="projects-header">
                <h2>Your Projects</h2>
                <button className="add-project-btn">
                    <PlusCircle size={18} />
                    Add New Project
                </button>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className={`project-card ${isProjectCompleted(project.name) ? 'completed' : ''}`}
                        onClick={() => handleProjectClick(project.name)}
                    >
                        {isProjectCompleted(project.name) && (
                            <div className="completed-icon">
                                <CheckCircle size={20} />
                            </div>
                        )}
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <div className="project-card-footer">
                            <span className="project-status">
                                {isProjectCompleted(project.name) ? 'Completed' : 'In Progress'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsComponent;