from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field, field_validator, model_validator


class LessonRequest(BaseModel):
    """Request payload for generating an interactive practice lesson."""

    problem: str = Field(
        ...,
        description="The user's digital task or problem description.",
    )

    @field_validator("problem")
    @classmethod
    def validate_problem(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Problem must be a string.")
        stripped = v.strip()
        if not stripped:
            raise ValueError("Problem cannot be empty or contain only whitespace.")
        if len(stripped) > 500:
            raise ValueError(
                f"Problem length ({len(stripped)}) exceeds maximum allowed limit of 500 characters."
            )
        return stripped


class LessonButton(BaseModel):
    """An interactive button option presented in a practice step."""

    id: str = Field(..., description="Unique button identifier within the step.")
    label_en: str = Field(..., description="English button label.")
    label_ur: str = Field(..., description="Urdu button label.")


class Hint(BaseModel):
    """Gentle, non-shaming correction hint when an incorrect button is tapped."""

    en: str = Field(..., description="Correction hint in English.")
    ur: str = Field(..., description="Correction hint in Urdu.")


class LessonStep(BaseModel):
    """A single interactive step in the Confidence Loop practice sequence."""

    screen: Literal["home", "app", "chat", "form"] = Field(
        ...,
        description="Screen context on the simulated smartphone.",
    )
    app_name: str = Field(..., description="Name of the app being simulated.")
    instruction_en: str = Field(..., description="Step instruction in English.")
    instruction_ur: str = Field(..., description="Step instruction in Urdu.")
    buttons: List[LessonButton] = Field(
        ...,
        min_length=2,
        max_length=4,
        description="2 to 4 interactive options presented to the learner.",
    )
    correct_button_id: str = Field(
        ...,
        description="ID of the correct button to advance the lesson.",
    )
    hints: Dict[str, Hint] = Field(
        default_factory=dict,
        description="Correction hints keyed by incorrect button ID.",
    )
    success_en: str = Field(..., description="Encouraging feedback in English upon correct action.")
    success_ur: str = Field(..., description="Encouraging feedback in Urdu upon correct action.")

    @model_validator(mode="after")
    def validate_correct_button_id(self) -> "LessonStep":
        button_ids = {btn.id for btn in self.buttons}
        if self.correct_button_id not in button_ids:
            raise ValueError(
                f"correct_button_id '{self.correct_button_id}' does not exist in buttons {list(button_ids)}."
            )
        return self


class LessonResponse(BaseModel):
    """Response payload returned by the AI lesson generation endpoint."""

    title_en: str = Field(..., description="Lesson title in English.")
    title_ur: str = Field(..., description="Lesson title in Urdu.")
    steps: List[LessonStep] = Field(
        ...,
        min_length=1,
        max_length=5,
        description="1 to 5 sequential practice steps.",
    )
    source: Literal["ai", "preset"] = Field(
        ...,
        description="Source of the lesson: 'ai' or 'preset'.",
    )
    note_en: Optional[str] = Field(None, description="Optional note in English.")
    note_ur: Optional[str] = Field(None, description="Optional note in Urdu.")
    disclaimer_en: str = Field(..., description="Guidance disclaimer in English.")
    disclaimer_ur: str = Field(..., description="Guidance disclaimer in Urdu.")
