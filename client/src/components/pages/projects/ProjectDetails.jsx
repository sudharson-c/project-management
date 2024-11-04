import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import DeleteModal from "../../sub/DeleteModal";
import EditModal from "../../sub/EditModal";
import ApplyModal from '../apply/ApplyModal'

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { project_id } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/projects/${project_id}`);
            const projectData = response.data;
            // Filter applications only for the current user
            const filteredApplications = projectData.application
                ? projectData.application.filter((application) => application.applier === currentUser.id)
                : {};
            // Update the project state with filtered applications
            setProject({
                ...projectData,
                application: filteredApplications[0],
            });
            console.log(project)
        } catch (error) {
            console.error("Error fetching project details:", error);
        }
    };

    fetchProject();
}, [project_id, currentUser.id]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:5000/projects/${project_id}`).then(()=>{console.log("Success")});
      window.alert("Deleted successfully");
      navigate("/projects"); // Redirect to the projects list after deletion
    } catch (error) {
      console.error("Error deleting project:", error);
      window.alert("Failed to delete the project. Please try again.");
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleApply = () => {
    setApplyModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setApplyModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };
  const handleViewApplications =()=>{
    navigate(`/projects/${project_id}/applications`, {
      state: { applications: project.application, projectName: project.project_name },
    });
  }

  if (!project) {
    return (
      <div>
        <button
          className="border border-fuchsia-500 rounded-md p-3"
          onClick={handleBack}
        >
          Go back
        </button>
        Loading project details...
      </div>
    );
  }

  return (
    <div>
      {applyModalOpen && <ApplyModal project={project} close={handleModalClose} />}
      {editModalOpen && <EditModal project={project} close={handleModalClose} />}
      {deleteModalOpen && (
        <DeleteModal
          project={project}
          close={handleModalClose}
          onDelete={handleDeleteProject}
        />
      )}
      <button
        className="border border-fuchsia-500 rounded-md p-3"
        onClick={handleBack}
      >
        Go back
      </button>

      <center>
        <div className="rounded-md p-2">
          <h2 className="text-xl font-bold">{project.project_name}</h2>
          <p className="mt-2">{project.project_desc}</p>
          <b>Github link : <a
            href={project.project_link}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a></b>
          <div className="mt-4">
            <h3 className="font-semibold">Owner:</h3>
            <p>{project.owner.firstName + " " + project.owner.lastName}</p>
            <h3 className="font-semibold">Status:</h3>
            <p>{project.status}</p>
            <h3 className="font-semibold">Stipend:</h3>
            <p>Rs {project.stipend}</p>
            <h3 className="font-semibold">Benefits:</h3>
            <p>{project.benefits}</p>
            <h3 className="font-semibold">Members Needed:</h3>
            <p>{project.members_needed}</p>
          </div>
          <div className="flex justify-center gap-2">
            {currentUser.primaryEmailAddress.emailAddress === project.owner.email ? (
              <>
                <button
                  className="border border-fuchsia-500 rounded-md p-2 w-max "
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="text-white bg-red-500 rounded-md p-2 w-max"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <br />
                <button onClick={handleViewApplications} className="border border-lime-500 rounded-md p-2">View Applications</button>
              </>
            ) : (
              project.application ?
              (<strong className={project.application.status==='ACCEPTED'?"text-lime-500":
                project.application.status==='REJECTED'?"text-red-500":""
              }>{project.application.status}</strong>):
              (<button
                className="border border-fuchsia-500 rounded-md p-1"
                onClick={handleApply}
              >
                Apply
              </button>)
              
            )}
            
          </div>
        </div>
      </center>
    </div>
  );
};

export default ProjectDetails;
