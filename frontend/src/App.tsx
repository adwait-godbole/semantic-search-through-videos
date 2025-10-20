/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, SearchIcon } from "lucide-react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import "./App.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formatTime } from "@/lib/utils";

interface SearchResult {
  ids: string[][];
  distances: number[][];
  metadatas: (null | any)[][];
  embeddings: null;
  documents: string[][];
  uris: null;
  data: null;
}

function App() {
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [timestamp, setTimestamp] = useState(0);
  const [loading, setLoading] = useState(false);
  const form = useForm({ defaultValues: { searchQuery: "" } });
  const playerRef = useRef<YouTubePlayer>(null);

  const handleVideoReady = (event: YouTubeEvent) => {
    const player = event.target;
    playerRef.current = player;
    player.playVideo();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    const res = await fetch(`http://127.0.0.1:8000/search/${data.searchQuery}`);
    const result = await res.json();
    setSearchResult(result);

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-[45.8rem] bg-gray-100 gap-[70px]">
      <h1 className="text-4xl font-bold">Truly Understanding a Video</h1>
      <div className="flex gap-8">
        <div className="w-[40rem] h-[25rem] rounded-lg shadow-md border border-black flex items-center justify-center">
          <YouTube
            videoId="T2aJvir564g"
            opts={{
              width: "600",
              height: "350",
              playerVars: {
                autoplay: 1,
                start: timestamp,
              },
            }}
            onReady={handleVideoReady}
            title="YouTube video player"
          />
        </div>
        <div className="w-[40rem] h-[25rem] rounded-lg shadow-md border border-black flex flex-col items-center gap-5 p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full items-center space-x-2"
            >
              <FormField
                control={form.control}
                name="searchQuery"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Search query here..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button variant="default" type="submit">
                <SearchIcon className="h-4 w-4 mr-1" /> Search
              </Button>
            </form>
          </Form>
          <ScrollArea className="w-full">
            {!loading && searchResult ? (
              <div className="flex flex-col gap-2 p-4 rounded-lg shadow-md border border-black">
                {searchResult.ids[0].map((id, index) => (
                  <div
                    key={id}
                    className="cursor-pointer hover:bg-gray-200 text-lg flex items-center gap-4 rounded-lg shadown-md border border-black w-full h-full px-3 py-2"
                    onClick={() => setTimestamp(parseInt(id))}
                  >
                    <Button variant="default" size="sm">
                      <ArrowLeft />
                    </Button>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg">
                        {searchResult.documents[0][index]}
                      </span>
                      <span className="text-base">
                        <a
                          href="#"
                          className="text-blue-700 hover:text-blue-900 transition-colors duration-100"
                        >
                          {formatTime(parseInt(id.split("-")[0]))}
                        </a>{" "}
                        {id.split("-")[1] && (
                          <>
                            -{" "}
                            <a
                              href="#"
                              className="text-blue-700 hover:text-blue-900 transition-colors duration-100"
                            >
                              {formatTime(parseInt(id.split("-")[1]))}
                            </a>
                          </>
                        )}{" "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              loading && (
                <div className="flex items-center justify-center w-full h-full">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default App;
