import modal

app = modal.App("muse-glimmer-server")

vllm_image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install(
        "vllm==0.4.0.post1",
        "huggingface_hub",
        "fastapi"
    )
)

MODEL_NAME = "meta-models/Muse-Glimmer-30B"

# এখানে স্পেসিফিকভাবে A100 এর 80GB ভার্সনটি কল করা হয়েছে এবং আপনার সিক্রেট যুক্ত করা হয়েছে
@app.cls(
    gpu=modal.gpu.A100(size="80GB"), 
    image=vllm_image, 
    secrets=[modal.Secret.from_name("my-openai-secret")],
    container_idle_timeout=300
)
class MuseGlimmerModel:
    @modal.enter()
    def load_model(self):
        from vllm import LLM
        self.llm = LLM(model=MODEL_NAME, trust_remote_code=True)

    @modal.method()
    def generate(self, prompt: str):
        from vllm import SamplingParams
        sampling_params = SamplingParams(temperature=0.7, top_p=0.9, max_tokens=512)
        outputs = self.llm.generate([prompt], sampling_params)
        return outputs[0].outputs[0].text

@app.function(image=vllm_image)
@modal.web_endpoint(method="POST")
def chat_endpoint(request: dict):
    model = MuseGlimmerModel()
    user_prompt = request.get("prompt", "")
    response = model.generate.remote(user_prompt)
    return {"response": response}