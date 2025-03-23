---
categories:
  - blog
date: 2025-03-09 13:00:00 +0000
tags:
  - AI
  - Tutorial
title: AI Character Tutorial Part 1
year: 2025
layout: thoughts
draft: true
---

It's March of 2025, and a lot of new advancements have been made in the generative art space. I was also lucky to have snagged a 3090 TI back when they first came out, and its 24GB VRAM allows you to do pretty much anything with diffusion models on your own machine. As for the LLM space, you'll still need to shell out 100GB+ VRAM to get something close to Claude and OpenAI's frontier models to run locally.

And so I'd like to catalogue my experience trying out various AI art techniques. The first tutorial will be creating your own "AI character" that you can have appear in any prompt you enter. The easiest method to accomplish this is with <a href="https://github.com/VectorSpaceLab/OmniGen?tab=readme-ov-file" target="_blank" class="link-primary">OmniGen</a>. You may be able to run it with as little as 8GB VRAM, but you'll need to mess with a <a href="https://github.com/VectorSpaceLab/OmniGen/blob/main/docs/inference.md#requiremented-resources" target="_blank" class="link-primary">few settings</a>.

You could follow their instructions to get their demo running locally, but to be able to make more complicated workflows that automate various common tasks, we'll be setting up a UI to interface with various diffusion models, LoRA's, high-res fixes, and what-have-you. There are a handful of open-source UI frontends for this like <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui" target="_blank" class="link-primary">Stable Diffusion WebUI</a>, <a href="https://github.com/invoke-ai/InvokeAI" target="_blank" class="link-primary">InvokeAI</a>, and even a <a href="https://github.com/LykosAI/StabilityMatrix" target="_blank" class="link-primary">UI that helps you manage and install all the other UI's</a>. We'll be using ComfyUI, as I've been following a Youtube channel called <a href="https://www.youtube.com/@NerdyRodent" target="_blank" class="link-primary">Nerdy Rodent</a> who provides excellent ComfyUI tutorials for cutting edge AI workflows, and provides these workflows for you to import if you subscribe to their Patreon (which I think is well worth the $5/mo!). I could direct you to their channel and call it a day, but there are a few things he doesn't address that I think is crucial if you plan to seriously experiment with AI art.

### Hardware

- Framework 16 AMD Ryzen™ 9 7940HS Laptop
  - 64GB RAM
  - Its hybrid GPU has 2GB VRAM but we won't be using it
- Nvidia 3090 Ti in an eGPU enclosure
  - 24GB VRAM

These instructions will be for Linux and assume you're comfortable with the terminal, specifically Bash on Fedora 41. MacOS may work as well with a few adjustments. As for Windows, I recommend deleting your Windows partition. It will also be Nvidia specific, but hopefully when the Framework Desktop drops with their 128GB VRAM AMD chips I can figure this out with ROCm or tooling that runs CUDA on AMD. Don't worry if none of that makes sense, as it likely doesn't apply to you.

### Setup or Python Sucks

If you already have Python projects, or plan to install other Python projects, I highly recommend setting up `asdf`. It's a tool that allows you to manage multiple versions of software on your machine. It's particularly useful for managing Python environments, as it allows you to easily switch between different versions of Python and packages. Combine this with `venv` and you can be sure that the next time you try to get an old project running that it will Just Work™.

You'll first go through `asdf`'s <a href="https://asdf-vm.com/guide/getting-started.html" target="_blank" class="link-primary">installation guide</a>. When I first started using `asdf`, their git installation was the recommended method. But now they recommend using a package manager, pointing to homebrew and AUR. Since Fedora has neither of these, you could set up <a href="https://docs.brew.sh/Homebrew-on-Linux" target="_blank" class="link-primary">linuxbrew</a>, but I'm still using the git version without issue.

After you've configured your terminal to support `asdf`, you can add a `.tool-versions` file to the root of any python project you come across and put in `python 3.11.4` for `asdf install` to always install and use that specific version with your python commands.

First `git clone https://github.com/comfyanonymous/ComfyUI` in wherever you keep your projects. then `cd ComfyUI` and `touch .tool-versions`. Open that file and enter `python 3.12.9`, which is their recommended version today. Check the repo if that has changed since I've written this. Then run `asdf install`, and you should have the proper python version installed on your system.

But before we start installing dependencies, we'll want to encapsulate them in their own environment so other projects using `python 3.12.9` don't install conflicting packages<a href="#ref1" class="link-primary">[1]</a>. At the root of the project, run `python -m venv ./venv` to create a virtual environment in a folder called `venv`. Now run `source ./venv/bin/activate` to enter this virtual environment to install python packages in it. Continue following <a href="https://github.com/comfyanonymous/ComfyUI?tab=readme-ov-file#manual-install-windows-linux" target="_blank" class="link-primary">the instructions</a> in ComfyUI to install all of its dependencies for both your GPU and ComfyUI in general.

After all of that, you can now run `python main.py` to start ComfyUI and access it at `localhost:8188` in your browser (assuming you didn't change the default port).

At this point it might be worth creating an alias to start the project properly. If you don't have one already, create a `~/.aliases` file (or wherever you wish to manage them) and add `source ~/.aliases` to your `.bashrc`. Then in `~/.aliases`, add the line `alias comfy='cd ~/Projects/ComfyUI && asdf install && source ./venv/bin/activate && python main.py'`, swapping `~/Projects/ComfyUI` with where you cloned the project. Source `.bashrc` or restart your terminal, and you should be able to start up ComfyUI from anywhere by running `comfy` in the terminal.

### ComfyUI

Phew, that was a lot of setup! From here on out, things should be a lot more straightforward. The first thing you'll want to do is to follow <a href="https://github.com/ltdrdata/ComfyUI-Manager" target="_blank" class="link-primary">the installation instructions for the ComfyUI Mod Manager</a>. We'll follow the Method 1 instructions, which at this time is just cloning the repo into the `custom_nodes` folder with `comfyui-manager` as the directory name. From there, you can restart ComfyUI and see a new button in the top right for the mod manager.

TODO: Screenshot here

Once that's all set up, I'll essentially be repeating Nerdy Rodent in <a href="https://www.youtube.com/watch?v=mwiz1PNDWGg" target="_blank" class="link-primary">their wonderful tutorial for OmniGen</a>. All you need to do is search for `ComfyUI-OmniGen` in Mod Manager, and install it. This will make sure their custom ComfyUI node project is downloaded and installs all its dependencies. Once this completes, restart ComfyUI.

TODO: screenshot of searching for omnigen
TODO: file of omnigen workflow

From there, you can take any

<p><span id="ref1" class="link-primary">[1]</span> Trust me, Python is _notorious_ for dependency hell, you'll thank me later
