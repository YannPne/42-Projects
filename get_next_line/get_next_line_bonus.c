/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/10 13:46:40 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/10 13:47:39 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line_bonus.h"

char	*ft_free(char *stash, char *buf)
{
	char	*temp;

	temp = ft_strjoin(stash, buf);
	free(stash);
	return (temp);
}

char	*ft_next(char *stash)
{
	int		i;
	int		j;
	char	*line;

	i = 0;
	while (stash[i] && stash[i] != '\n')
		i++;
	if (!stash[i])
	{
		free(stash);
		return (NULL);
	}
	line = ft_calloc((ft_strlen(stash) - i + 1), sizeof(char));
	i++;
	j = 0;
	while (stash[i])
		line[j++] = stash[i++];
	free(stash);
	return (line);
}

char	*ft_line(char *stash)
{
	char	*line;
	int		i;

	i = 0;
	if (!stash[i])
		return (NULL);
	while (stash[i] && stash[i] != '\n')
		i++;
	line = ft_calloc(i + 2, sizeof(char));
	i = 0;
	while (stash[i] && stash[i] != '\n')
	{
		line[i] = stash[i];
		i++;
	}
	if (stash[i] && stash[i] == '\n')
		line[i++] = '\n';
	return (line);
}

char	*read_file(int fd, char *result)
{
	char	*stash;
	int		byte_read;

	if (!result)
		result = ft_calloc(1, 1);
	stash = ft_calloc(BUFFER_SIZE + 1, sizeof(char));
	byte_read = 1;
	while (byte_read > 0)
	{
		byte_read = read(fd, stash, BUFFER_SIZE);
		if (byte_read == -1)
		{
			free(stash);
			return (NULL);
		}
		stash[byte_read] = 0;
		result = ft_free(result, stash);
		if (ft_strchr(stash, '\n'))
			break ;
	}
	free(stash);
	return (result);
}

char	*get_next_line(int fd)
{
	static char	*stash[256];
	char		*line;

	if (fd < 0 || BUFFER_SIZE <= 0 || read(fd, 0, 0) < 0)
		return (NULL);
	stash[fd] = read_file(fd, stash[fd]);
	if (!stash[fd])
		return (NULL);
	line = ft_line(stash[fd]);
	stash[fd] = ft_next(stash[fd]);
	return (line);
}

/*
#include <stdio.h>
#include <fcntl.h>
#include "get_next_line_bonus.h"

int main(void)
{
    int fd1, fd2;
    char *line;

    // Ouvrir les fichiers en lecture seule
    fd1 = open("file1.txt", O_RDONLY);
    fd2 = open("file2.txt", O_RDONLY);
    if (fd1 == -1 || fd2 == -1)
    {
        perror("Error opening file");
        return (1);
    }

    // Lire et afficher les lignes du premier fichier
    printf("Reading from test1.txt:\n");
    while ((line = get_next_line(fd1)) != NULL)
    {
        printf("%s", line);
        free(line);
    }

    // Lire et afficher les lignes du deuxième fichier
    printf("\nReading from test2.txt:\n");
    while ((line = get_next_line(fd2)) != NULL)
    {
        printf("%s", line);
        free(line);
    }

    // Fermer les fichiers
    close(fd1);
    close(fd2);
    return (0);
}
*/
