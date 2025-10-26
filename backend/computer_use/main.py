# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import argparse
import os

from computer_use.agent import BrowserAgent
from computer_use.computers import PlaywrightComputer




def gemini_computer_use(query: str, initial_url: str = "http://www.google.com", model="gemini-2.5-computer-use-preview-10-2025") -> int:

    PLAYWRIGHT_SCREEN_SIZE = (1440, 900)


    env = PlaywrightComputer(
        screen_size=PLAYWRIGHT_SCREEN_SIZE,
        initial_url=initial_url,
        highlight_mouse=False,
    )   

    with env as browser_computer:
        agent = BrowserAgent(
            browser_computer=browser_computer,
            query=query,
            model_name=model,
        )
        agent.agent_loop()

    return 0


if __name__ == "__main__":
    user_input = input("You: ")

    gemini_computer_use(user_input)
