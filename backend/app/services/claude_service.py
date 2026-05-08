import os
import json
import logging
from anthropic import AsyncAnthropic
from app.models.schemas import EmergencyDetectionRequest, EmergencyDetectionResponse

logger = logging.getLogger(__name__)

# Initialize client if API key exists
# Using AsyncAnthropic for async support
client = AsyncAnthropic(api_key=os.environ.get("CLAUDE_API_KEY", ""))

async def analyze_emergency(data: EmergencyDetectionRequest) -> EmergencyDetectionResponse:
    """
    Simulates AI emergency vehicle detection using Claude API.
    If the API fails or no key is provided, it falls back to a mock response.
    """
    
    if not os.environ.get("CLAUDE_API_KEY") or os.environ.get("CLAUDE_API_KEY") == "your_anthropic_api_key_here":
        logger.warning("CLAUDE_API_KEY not set or invalid. Using mock response.")
        return _get_mock_response(data)

    prompt = f"""
    You are an AI Traffic Analysis System. Analyze the following data:
    - Vehicle Type: {data.vehicle_type}
    - Siren Detected: {data.siren_detected}
    - Image Description: {data.image_description}

    Determine if there is an active emergency.
    Return ONLY a JSON object with the following structure:
    {{
        "emergency_detected": boolean,
        "vehicle": "string (e.g., ambulance, fire truck, none)",
        "priority_level": "string (high, medium, low, none)",
        "recommended_action": "string (e.g., clear_signals, monitor, none)"
    }}
    """

    try:
        response = await client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            temperature=0.1,
            system="You are a smart traffic management AI. Always respond in valid JSON format only.",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        content = response.content[0].text
        # Clean up any markdown json formatting if Claude included it
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        parsed_json = json.loads(content)
        return EmergencyDetectionResponse(**parsed_json)
        
    except Exception as e:
        logger.error(f"Claude API failed: {str(e)}. Falling back to mock response.")
        return _get_mock_response(data)

def _get_mock_response(data: EmergencyDetectionRequest) -> EmergencyDetectionResponse:
    """Fallback mock response logic based on simple rules."""
    is_emergency = data.siren_detected or "ambulance" in data.vehicle_type.lower() or "fire" in data.vehicle_type.lower()
    
    if is_emergency:
        return EmergencyDetectionResponse(
            emergency_detected=True,
            vehicle="ambulance" if "ambulance" in data.vehicle_type.lower() else data.vehicle_type,
            priority_level="high",
            recommended_action="clear_signals"
        )
    else:
        return EmergencyDetectionResponse(
            emergency_detected=False,
            vehicle=data.vehicle_type,
            priority_level="none",
            recommended_action="monitor"
        )
