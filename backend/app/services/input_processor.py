from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional
import re

class InputProcessor:
    @staticmethod
    def _extract_youtube_id(url: str) -> Optional[str]:
        """Extracts video ID from YouTube URL."""
        # Standard format
        match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
        if match:
            return match.group(1)
        return None

    @staticmethod
    def process_youtube(url: str) -> str:
        """Fetches transcript from YouTube video."""
        video_id = InputProcessor._extract_youtube_id(url)
        if not video_id:
            raise ValueError("Invalid YouTube URL")
        
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'ko'])
            # Combine text
            full_text = " ".join([item['text'] for item in transcript_list])
            return full_text
        except Exception as e:
            raise ValueError(f"Failed to fetch transcript: {str(e)}")

    @staticmethod
    def process_input(input_type: str, content: str) -> str:
        if input_type == "youtube":
            return InputProcessor.process_youtube(content)
        # Add pdf/web/image handlers later
        else:
            raise NotImplementedError(f"Input type {input_type} not yet supported")
