from pathlib import Path
import venv
from subprocess import run
import subprocess
import shutil
import os

def resolve_path(x):
    return str(x.resolve())


def main(args=None):
    import setup_env
    setup_env.main()

    this_file_dir = Path(__file__).parent.resolve()
    root_dir = this_file_dir.parent
    venv_interpreter_path = resolve_path(
        root_dir / 'env' / 'Scripts' / 'python')

    # gen_script_path = resolve_path(root_dir / 'backend' /
    #                                'tools' / 'gen_client_data.py')
    # results = run([venv_interpreter_path, gen_script_path],
    #               shell=True, check=True)
    # static_dest = resolve_path(
    #     root_dir /
    #     'frontend' /
    #     'src' /
    #     'data' /
    #     'dcs_static.json')
    # shutil.move('dcs_static.json', static_dest)
    node_modules_path = resolve_path(root_dir / 'frontend' / 'node_modules')
    shutil.rmtree(node_modules_path)
    cwd = os.getcwd()
    frontend_dir = resolve_path(root_dir / 'frontend')
    os.chdir(frontend_dir)
    run(['yarn'], shell=True, check=True)
    run(['yarn', 'build'], shell=True, check=True)
    os.chdir(cwd)
    
    build_dir = resolve_path(root_dir, 'frontend', 'build')
    build_dest = resolve_path(
        root_dir,
        'backend',
        'tauntaun_live_editor',
        'data',
        'client')
    shutil.copytree(build_dir, build_dest)

if __name__ == '__main__':
    main()
