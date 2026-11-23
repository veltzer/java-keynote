#!/usr/bin/python3

""" Print the tag name for the build. """

import subprocess  # for check_output, DEVNULL


def get_version():
    """ Return git describe output, or 'test' when unavailable. """
    try:
        return subprocess.check_output(['git', 'describe'],stderr=subprocess.DEVNULL).rstrip()
    except (subprocess.CalledProcessError, OSError):
        return 'test'

print(get_version())
