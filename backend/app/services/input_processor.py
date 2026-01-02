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
            # Instantiate the API (required for this version/environment)
            api = YouTubeTranscriptApi()
            
            # Use fetch with languages (supports 'ko' for the problematic video)
            transcript_list = api.fetch(video_id, languages=['ko', 'en', 'en-US'])
            
            # Combine text (fetch returns list of objects with .text attribute)
            full_text = " ".join([item.text for item in transcript_list])
            return full_text
        except Exception as e:
            # Fallback attempts or detailed error logging
            print(f"Transcript Error: {e}")
            raise ValueError(f"Could not retrieve transcript. Details: {str(e)}")

    @staticmethod
    def process_input(input_type: str, content: str) -> str:
        if input_type == "youtube":
            return InputProcessor.process_youtube(content)
        # Add pdf/web/image handlers later
        else:
            raise NotImplementedError(f"Input type {input_type} not yet supported")
