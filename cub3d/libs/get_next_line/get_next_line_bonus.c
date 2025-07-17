/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/10 13:46:40 by mmacia          #+#    #+#             */
/*   Updated: 2023/10/10 13:47:39 by mmacia         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line_bonus.h"

char	*ft_strcpy(char *dest, char *src)
{
	int		i;

	i = 0;
	while (src[i] != '\0')
	{
		dest[i] = src[i];
		i++;
	}
	dest[i] = '\0';
	return (dest);
}

static char	*text_read(int fd, char *buffer, char *stash)
{
	int		rline;
	char	*temp;

	rline = 1;
	while (rline > 0)
	{
		rline = read(fd, buffer, BUFFER_SIZE);
		if (rline == -1)
			return (NULL);
		if (rline <= 0)
		{
			if (rline == 0 && stash && stash[0] != '\0')
				break ;
			return (NULL);
		}
		buffer[rline] = '\0';
		if (!stash || (stash && !*stash))
			stash = ft_strdup("");
		temp = stash;
		stash = (ft_strjoin(temp, buffer));
		free(temp);
		if (ft_strchr(buffer, '\n'))
			break ;
	}
	return (stash);
}

char	*line_extract(char *l)
{
	int		i;
	char	*stash;

	i = 0;
	stash = NULL;
	if (stash && *stash == '\n')
		l = stash;
	if (l[i] == '\n')
		i++;
	else if (l[i] != '\n')
	{
		while (l[i] != '\n' && l[i] != '\0')
			i++;
		if (l[i] == '\n' && l[i] != '\0')
			i++;
	}
	if (BUFFER_SIZE != 1)
	{
		if ((l[0] == '\n' || i >= 1) && l[i])
			stash = ft_substr(l, i, ft_strlen(l) - i + 1);
		else if (i >= 1 && (l[i] == '\n' || l[i - 1] == '\n') && l[i])
			stash = ft_substr(l, i + 1, ft_strlen(l) - i + 1);
	}
	l[i] = '\0';
	return (stash);
}

char	*newline(char **stash)
{
	char	*line;
	char	*buffer;

	line = malloc(2 * sizeof(char));
	line = ft_strcpy(line, "\n");
	buffer = *stash;
	*stash = ft_substr(*stash, 1, ft_strlen(*stash) - 1);
	if (!*stash || (stash && !**stash))
		free(*stash);
	free(buffer);
	return (line);
}

char	*get_next_line(int fd)
{
	static char	*stash[2096];
	char		*buffer;
	char		*line;

	if (fd < 0 || BUFFER_SIZE <= 0 || read(fd, 0, 0) < 0)
	{
		if (stash[fd] && *stash[fd])
		{
			free(stash[fd]);
			stash[fd] = NULL;
		}
		return (NULL);
	}
	if (stash[fd] && *stash[fd] == '\n')
		return (newline(&stash[fd]));
	buffer = malloc(BUFFER_SIZE + 1 * sizeof(char));
	if (!buffer)
		return (NULL);
	line = text_read(fd, buffer, stash[fd]);
	free(buffer);
	if (line)
		stash[fd] = line_extract(line);
	return (line);
}
/*
int	main(void)
{
	char	*content;
	int fd = open("test", O_RDONLY);
	
	content = get_next_line(fd);
	printf("%s", content);
	free(content);

	content = get_next_line(fd);
	printf("%s", content);
	free(content);

	content = get_next_line(fd);
	printf("%s", content);
	close(fd);
	return (0);
}
*/
