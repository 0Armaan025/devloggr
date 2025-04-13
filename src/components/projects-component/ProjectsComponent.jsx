import React, { useState } from 'react';
import './projectscomponent.css';
import { useNavigate } from 'react-router-dom';

const ProjectsComponent = () => {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'Project 1',
            description: 'A web application for task management'
        },
        {
            id: 2,
            name: 'Project 2',
            description: 'E-commerce platform with React'
        },
        {
            id: 3,
            name: 'Project 3',
            description: 'Portfolio website with animations'
        },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [repoUrl, setRepoUrl] = useState('');

    const handleAddProject = () => {
        if (projectName.trim() && repoUrl.trim()) {
            const newProject = {
                id: projects.length + 1,
                name: projectName,
                description: projectDescription,
                repoUrl: repoUrl
            };
            setProjects([...projects, newProject]);
            setProjectName('');
            setProjectDescription('');
            setRepoUrl('');
            setShowModal(false);
        }
    };

    return (
        <div className="projects-container">

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-tile" onClick={() => {
                        navigate(`/project/${project.name}`);
                    }}>
                        <h3 className="project-name">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                    </div>
                ))}
                <div className="project-tile add-tile" onClick={() => setShowModal(true)}>
                    <span className="add-icon">+</span>
                    <span className="add-text">New Project</span>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Project</h3>
                        <div className="input-group">
                            <label htmlFor="projectName">Project Name (same as folder name)</label>
                            <input
                                type="text"
                                id="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="projectDescription">Project Description</label>
                            <textarea
                                id="projectDescription"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                placeholder="Enter project description"
                                rows="3"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="repoUrl">GitHub Repository URL</label>
                            <input
                                type="text"
                                id="repoUrl"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                placeholder="Enter GitHub repo URL"
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="create-btn" onClick={handleAddProject}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsComponent;