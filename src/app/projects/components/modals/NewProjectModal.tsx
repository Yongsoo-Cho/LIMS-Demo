import { useState } from "react";
import NewProjectDialog from "./NewProjectDialog";
import DiscardWarningModal from "./DiscardWarningModal";
import { TeamMember } from "@/app/types/project";
import { createClient } from "@/lib/supabase/browserClient";

type NewProjectModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
};

export default function NewProjectModal({
  isOpen,
  setIsOpen,
  onSuccess,
}: NewProjectModalProps) {
  const supabase = createClient();
  const [projectName, setProjectName] = useState<string>("");
  const [assignees, setAssignees] = useState<TeamMember[]>([]);
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showDiscardWarning, setShowDiscardWarning] = useState<boolean>(false);

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

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (assignees.length === 0) {
      alert("Please assign at least one team member.");
      return;
    }

    if (!dueDate) {
      alert("Please select a due date.");
      return;
    }
    const newProject = {
      name: projectName,
      description: description,
      status: "Planning",
      assignees: assignees.map((a) => a.id),
      due_date: dueDate || null,
      coordinates: null,
    };
    console.log(newProject);

    const { error } = await supabase.from("projects").insert([newProject]);
    if (error) {
      alert(`Error creating project: ${error.message}`);
      console.error("Supabase insert error:", error);
      return;
    } else {
      onSuccess?.();
      setProjectName("");
      setAssignees([]);
      setDueDate("");
      setDescription("");
      setIsOpen(false);
    }
  };

  return (
    <>
      <NewProjectDialog
        isOpen={isOpen}
        projectName={projectName}
        onChange={setProjectName}
        assignees={assignees}
        setAssignees={setAssignees}
        dueDate={dueDate}
        setDueDate={setDueDate}
        description={description}
        setDescription={setDescription}
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
