import { useState } from "react";
import NewProjectDialog from "./NewProjectDialog";
import DiscardWarningModal from "./DiscardWarningModal";
import { ProjectAssignee } from "@/app/types/project";

type NewProjectModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function NewProjectModal({
  isOpen,
  setIsOpen,
}: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [assignees, setAssignees] = useState<ProjectAssignee[]>([]);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  const handleMainClose = () => {
    const hasDraft = projectName.trim() || assignees.length > 0;
    if (hasDraft) {
      setShowDiscardWarning(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleDiscard = () => {
    setProjectName("");
    setAssignees([]);
    setShowDiscardWarning(false);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    console.log("Project name:", projectName);
    console.log("Assignees:", assignees);
    // Reset state
    setProjectName("");
    setAssignees([]);
    setIsOpen(false);
  };

  return (
    <>
      <NewProjectDialog
        isOpen={isOpen}
        projectName={projectName}
        onChange={setProjectName}
        assignees={assignees}
        setAssignees={setAssignees}
        onClose={handleMainClose}
        onSubmit={handleSubmit}
      />
      <DiscardWarningModal
        isOpen={showDiscardWarning}
        onCancel={() => setShowDiscardWarning(false)}
        onDiscard={handleDiscard}
      />
    </>
  );
}
