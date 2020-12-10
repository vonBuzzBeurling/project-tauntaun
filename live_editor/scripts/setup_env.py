import os
from pathlib import Path
import venv
from subprocess import run


def resolve_path(x):
    return str(x.resolve())


def main(args=None):
    cwd = os.getcwd()
    this_file_dir = Path(__file__).parent.resolve()
    root_dir = this_file_dir.parent
    os.chdir(root_dir)
    run(['git', 'submodule', 'update', '--init', '--recursive'])

    venv.create("env", with_pip=True)
    venv_interpreter_path = resolve_path(
        root_dir / 'env' / 'Scripts' / 'python')
    requirements_path = resolve_path(root_dir.parent / 'requirements.txt')
    run([venv_interpreter_path, '-m', 'pip', 'install', '--upgrade', 'pip'])
    results = run([venv_interpreter_path, '-m', 'pip', 'install', '-r',
                   requirements_path], shell=True, check=True)

    os.chdir(str(root_dir / 'frontend'))
    results = run(['yarn', 'install'], shell=True, check=True)
    try:
        os.mkdir(os.path.join(root_dir, 'frontend', 'src', 'data'))
    except FileExistsError:
        pass
    os.chdir(cwd)


if __name__ == '__main__':
    main()
