import React from "react";
import { Draggable } from "react-beautiful-dnd";

const DragCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p>{task.title}</p>
        </div>
      )}
    </Draggable>
  );
};

export default DragCard;