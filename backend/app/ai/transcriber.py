import os
import whisper
from typing import Dict, Any

class WhisperTranscriber:
    def __init__(self, model_name: str = "base"):
        self.model_name = model_name
        self._model = None

    @property
    def model(self):
        if self._model is None:
            self._model = whisper.load_model(self.model_name)
        return self._model

    def transcribe(self, audio_path: str) -> Dict[str, Any]:
        """
        Transcribe audio using the whisper python library.
        """
        try:
            # Ensure file exists
            if not os.path.exists(audio_path):
                return {"error": f"File not found: {audio_path}"}
                
            result = self.model.transcribe(audio_path)
            
            return {
                "text": result.get("text", ""),
                "segments": result.get("segments", [])
            }
        except Exception as e:
            print(f"Transcription failed: {e}")
            return {"error": str(e)}

transcriber = WhisperTranscriber()
